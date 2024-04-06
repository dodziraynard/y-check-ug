package com.hrd.ycheck.adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.load.engine.DiskCacheStrategy
import com.bumptech.glide.request.RequestOptions
import com.hrd.ycheck.R
import com.hrd.ycheck.databinding.ItemAdolescentBinding
import com.hrd.ycheck.models.Adolescent

class AdolescentAdapter(private val context: Context) :
    RecyclerView.Adapter<AdolescentAdapter.AdolescentViewHolder>() {
    private var dataset = listOf<Adolescent>()

    private var listener: OnItemClickListener? = null

    interface OnItemClickListener {
        fun itemClickListener(adolescent: Adolescent)
    }

    fun setOnItemClickListener(listener: OnItemClickListener) {
        this.listener = listener
    }

    inner class AdolescentViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        private val binding = ItemAdolescentBinding.bind(view)

        fun bind(adolescent: Adolescent) {
            val fullName = "${adolescent.surname} ${adolescent.otherNames}"
            with(binding) {
                fullnameLabel.text = fullName
                pidLabel.text = adolescent.pid
                details.text = "${adolescent.school}, ${adolescent.type}"

                if (adolescent.photoUrl?.isNotEmpty() == true) {
                    val imageUrl = adolescent.photoUrl
                    val options: RequestOptions =
                        RequestOptions().fitCenter().placeholder(R.drawable.profile_avatar)
                            .error(R.drawable.placeholder)
                    Glide.with(context).load(imageUrl).apply(options)
                        .diskCacheStrategy(DiskCacheStrategy.AUTOMATIC).into(imageView)
                }

                cardView.setOnClickListener {
                    listener?.itemClickListener(adolescent)
                }
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AdolescentViewHolder {
        val binding =
            ItemAdolescentBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return AdolescentViewHolder(binding.root)
    }

    override fun onBindViewHolder(holder: AdolescentViewHolder, position: Int) {
        holder.bind(dataset[position])
    }

    fun setData(dataset: List<Adolescent>) {
        this.dataset = dataset
        notifyDataSetChanged()
    }

    override fun getItemCount() = this.dataset.size;
}